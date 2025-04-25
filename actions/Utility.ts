

export const getDaysAgo = (date:Date) => {
  const givenDate:any = new Date(date);
  const now:any = new Date();

  const diffInMs = givenDate-now;
  const msInDay = 1000 * 60 * 60 * 24;

  return Math.floor(diffInMs / msInDay);
};

export const formatDate = (timestamp:Date) => {
  const date = new Date(timestamp);
  
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }); 
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};


export const renderContributionCycle=(cycle:string)=>{
  switch(cycle){
    case "daily":
      return "Kila Siku";

    case "weekly":
      return "Kila Wiki";

    
    case "biweekly":
      return "Kila Baada ya Wiki Mbili";

    case "monthly":
      return "Kila Mwezi";
    
    default:
      return "Chagua Mzunguko wa Michango";
  }
}

export const renderPaymentArrangement=(val:string)=>{
  
  switch(val){
    case "random":
      return "Bahati Nasibu";
    
    case "sequential":
      return "Mfuatano wa Kujiunga";
    
    case "byNeed":
      return "Kulingana na Mahitaji";
    
    case "custom":
      return "Utaratibu Maalum";
    
    default:
      return "Utaratibu Maalum";
  }
}
