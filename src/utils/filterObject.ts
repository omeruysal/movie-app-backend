export const filterObj = (obj: any, ...allowedFields: string[]): any => {
  // We can get the fields which we want and not null
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
