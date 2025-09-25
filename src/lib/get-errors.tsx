type ErrorObject = {
  [key: string]: string;
};

type ErrorInput = string | string[] | ErrorObject | ErrorObject[] | undefined;

export const getErrors = (errors: ErrorInput) => {
  if (!errors) return null;

  const getErrorMessage = (error: string | ErrorObject): string => {
    if (typeof error === "string") return error;
    return Object.values(error)[0];
  };

  const errorsArray = Array.isArray(errors)
    ? errors.map(getErrorMessage)
    : [getErrorMessage(errors)];

  return (
    <div className="error-container">
      {errorsArray.map((error, index) => (
        <p key={index} className="text-red-500">
          {error}
        </p>
      ))}
    </div>
  );
};
