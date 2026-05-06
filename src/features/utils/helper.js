const createObjectToFormData =(object)=>{

    const formData = new FormData()
    //   console.log(Object.keys(quotationData))
      Object.keys(object).forEach(key => {
        if (Array.isArray(object[key])) {
          object[key].forEach(item => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, object[key]);
        }
      });

      return formData;
}

const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  const initials = names.map((n) => n[0]).join('');
  return initials.toUpperCase();
};

export {createObjectToFormData , getInitials}