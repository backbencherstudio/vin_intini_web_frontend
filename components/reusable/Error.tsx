function Error() {
  return (
    <div>
      {" "}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-red-500">500</h1>

          <p className="mt-4 text-lg text-gray-600">Something went wrong.</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-black text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default Error;
