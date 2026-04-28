// export const asyncHandler = (fn) => async(req,res,next) => {
//   await Promise.resolve(fn(req,res,next)).then(next(error));
// }


export const asyncHandler = (fn) => async(req,res,next) => {
  await Promise.resolve(fn(req,res,next)).catch(next);
}