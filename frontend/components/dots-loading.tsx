interface DotsLoadingProps {
  size?: number;
}

function DotsLoading({ size = 8 }: DotsLoadingProps) {
  return (
    <div className="flex space-x-1 justify-center items-center">
      <span className="sr-only">Loading...</span>
      <div
        className={`bg-neutral-600 rounded-full animate-bounce [animation-delay:-0.3s]`}
        style={{ width: size, height: size }}
      ></div>
      <div
        className={`bg-neutral-600 rounded-full animate-bounce [animation-delay:-0.15s]`}
        style={{ width: size, height: size }}
      ></div>
      <div
        className={`bg-neutral-600 rounded-full animate-bounce`}
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
}

export default DotsLoading;
