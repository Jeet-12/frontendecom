const createObjectToFormData =(object)=>{

    const formData = new FormData()
    //   console.log(Object.keys(quotationData))
      Object.keys(object).forEach(key=>{
        // console.log(key)
        formData.append(key, object[key])
      })

      return formData;
}

const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  const initials = names.map((n) => n[0]).join('');
  return initials.toUpperCase();
};

export {createObjectToFormData , getInitials}