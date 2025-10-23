import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";

export default function RouteError() {
  const error = useRouteError();
  let title = "Something went wrong";
  let detail = "";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    detail = error.data || "";
  } else if (error instanceof Error) {
    detail = error.message;
  }
  return (
    <div className="container-oodl py-12">
      <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-8">
        <h1 className="text-xl font-semibold mb-2">{title}</h1>
        {detail && (
          <pre className="text-sm opacity-80 whitespace-pre-wrap">
            {String(detail)}
          </pre>
        )}
        <div className="mt-4">
          <Link to="/" className="px-4 py-2 rounded-md bg-blue-600 text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
