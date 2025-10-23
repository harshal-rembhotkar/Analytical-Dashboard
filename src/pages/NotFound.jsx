import { Link, useRouteError } from "react-router-dom";

export default function NotFound() {
  const error = useRouteError?.() || {};
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--card)] p-8 text-center">
      <h1 className="text-2xl font-semibold mb-2">404 Not Found</h1>
      <p className="text-sm text-gray-500 mb-6">
        The page you’re looking for doesn’t exist.
      </p>
      {error?.statusText && (
        <p className="text-xs text-gray-400 mb-4">{String(error.statusText)}</p>
      )}
      <Link className="px-4 py-2 rounded-md bg-blue-600 text-white" to="/">
        Go to Dashboard
      </Link>
    </div>
  );
}
