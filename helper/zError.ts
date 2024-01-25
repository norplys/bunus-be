const errorMap = (err: any) => {
  return err.errors.map((error: any) => {
    const key = error.path.join(".");
    return {
      [key]: error.message,
    };
  });
};

export { errorMap };
