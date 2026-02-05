export const exampleAction = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return {
    sucess: true,
    message: "Action completed successfully",
    data: null,
  };
};
