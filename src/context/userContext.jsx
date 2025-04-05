import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// userData 형태
// RESPONSE 형태
// {
//     "result": "SUCCESS",
//     "data": {
//         "userId": "2024102129",
//         "userName": "정성호",
//         "userRole": "ADMIN"
//         + 사용자번호
//     },
//     "error": null
// }
