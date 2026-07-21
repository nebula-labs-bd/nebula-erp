import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginService } from "../auth/auth.service";
import { AuthContext } from "../auth/auth.context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const user = await loginService({
      email,
      password,
    });

    if (user) {
      auth?.login(user);

      navigate("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--nebula-background)]">
      <form
        onSubmit={handleSubmit}
        className="surface w-full max-w-md space-y-4 p-8"
      >
        <h1 className="text-2xl font-bold">
          Sign in to Nebula ERP
        </h1>

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="w-full rounded-lg bg-[var(--nebula-primary)] p-3 text-white"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}