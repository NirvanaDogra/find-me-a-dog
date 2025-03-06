"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "./api/auth";
import styles from "./page.module.css";

export interface LoginFormState {
  name: string;
  email: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  data?: string|null;
}

const validateForm = (state: LoginFormState): string[] => {
  const errors: string[] = [];

  if (!state.name.trim()) {
    errors.push("Name is required");
  } else if (state.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!state.email.trim()) {
    errors.push("Email is required");
  } else if (!emailRegex.test(state.email.trim())) {
    errors.push("Invalid email format");
  }

  return errors;
};

const Login = () => {
  const router = useRouter();
  const [state, setState] = useState<LoginFormState>({
    name: "",
    email: ""
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validateForm(state);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result: LoginResult = await loginUser(state);

      if (result.success) {
        setErrors([]);
        router.push('/dashboard');
      } else {
        setErrors([result.error || "Login failed"]);
      }
    } catch {
      setErrors(["An unexpected error occurred"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Find Me A Dog</title>
        <meta name="description" content="Login to access your dashboard and find your perfect dog." />
      </Head>
      <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>User Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={state.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.includes("Name is required") && (
              <p className={styles.errorText}>Name is required</p>
            )}
            {errors.includes("Name must be at least 2 characters") && (
              <p className={styles.errorText}>Name must be at least 2 characters</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={state.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.includes("Email is required") && (
              <p className={styles.errorText}>Email is required</p>
            )}
            {errors.includes("Invalid email format") && (
              <p className={styles.errorText}>Invalid email format</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;