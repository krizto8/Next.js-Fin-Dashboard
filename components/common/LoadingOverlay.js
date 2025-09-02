export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Loading Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Setting up your finance dashboard...
        </p>
      </div>
    </div>
  );
}
