exports.QUERY_PLXID_CUSTOMER =
`
select     
    plx_id,
    NVL(TO_CHAR(UPDATED_DATE, 'rrrrmmdd'), ' ') AS ZZDATE,
    name,
    NVL(TO_CHAR(openday, 'rrrrmmdd'), ' ') AS openday,
    NVL(TO_CHAR(SEX), ' ') AS SEX,             
    NVL(TO_CHAR(ID_TAXID), ' ') AS ID_TAXID,        
    NVL(TO_CHAR(CUS_TYPE), ' ') AS CUS_TYPE,        
    NVL(TO_CHAR(PHONE), ' ') AS PHONE,           
    NVL(TO_CHAR(EMAIL), ' ') AS EMAIL,          
    NVL(TO_CHAR(SECRET_QID1), ' ') AS SECRET_QID1,       
    NVL(TO_CHAR(SECRET_AID1), ' ') AS SECRET_AID1,       
    NVL(TO_CHAR(SECRET_QID2), ' ') AS SECRET_QID2,       
    NVL(TO_CHAR(SECRET_AID2), ' ') AS SECRET_AID2,       
    NVL(TO_CHAR(ADDRESS), ' ') AS ADDRESS,           
    NVL(TO_CHAR(PROVINCE_ID), ' ') AS PROVINCE_ID,       
    NVL(TO_CHAR(DISTRICT_ID), ' ') AS DISTRICT_ID,       
    NVL(TO_CHAR(WARD_ID), ' ') AS WARD_ID,             
    NVL(TO_CHAR(CREATED_DATE, 'rrrrmmdd'), ' ') AS CREATED_DATE,
    NVL(TO_CHAR(CREATED_DATE, 'hh24miss'), ' ') AS CREATED_TIME,
    NVL(TO_CHAR(UPDATED_DATE, 'rrrrmmdd'), ' ') AS UPDATED_DATE,
    NVL(TO_CHAR(UPDATED_DATE, 'hh24miss'), ' ') AS UPDATED_TIME,
    NVL(TO_CHAR(CYCLE_FROM_DATE, 'rrrrmmdd'), ' ') AS CYCLE_FROM_DATE,
    NVL(TO_CHAR(CYCLE_FROM_DATE, 'hh24miss'), ' ') AS CYCLE_FROM_TIME,  
    NVL(TO_CHAR(BIRTHDAY, 'rrrrmmdd'), ' ') AS BIRTHDAY,    
    NVL(TO_CHAR(STATUS), ' ') AS STATUS,            
    NVL(TO_CHAR(WORK_ADDRESS), ' ') AS WORK_ADDRESS,      
    NVL(TO_CHAR(JOB), ' ') AS JOB,               
    NVL(TO_CHAR(IS_VIP), ' ') AS IS_VIP,            
    NVL(TO_CHAR(SERVICE_TYPE), ' ') AS SERVICE_TYPE,      
    NVL(TO_CHAR(OTP_PHONE), ' ') AS OTP_PHONE,         
    NVL(SUBSTR(TO_CHAR(INVOICE_ADDRESS),0, 255), ' ') AS INVOICE_ADDRESS,   
    NVL(TO_CHAR(IS_UPDATED), ' ') AS IS_UPDATED,        
    NVL(TO_CHAR(BALANCE), ' ') AS BALANCE,           
    NVL(TO_CHAR(SYNC_EGAS), ' ') AS SYNC_EGAS,         
    NVL(TO_CHAR(IS_PRINT), ' ') AS IS_PRINT        
from PLXID.customer
WHERE trunc(UPDATED_DATE) between 
to_date(:fromDate, 'rrrrmmdd') and 
to_date(:toDate, 'rrrrmmdd')
`;

exports.QUERY_PLXID_CUSTOMER_DELETED =
`
select     
    plx_id,
    NVL(TO_CHAR(UPDATED_DATE, 'rrrrmmdd'), ' ') AS ZZDATE,
    name,
    NVL(TO_CHAR(openday, 'rrrrmmdd'), ' ') AS openday,
    NVL(TO_CHAR(SEX), ' ') AS SEX,             
    NVL(TO_CHAR(ID_TAXID), ' ') AS ID_TAXID,        
    NVL(TO_CHAR(CUS_TYPE), ' ') AS CUS_TYPE,        
    NVL(TO_CHAR(PHONE), ' ') AS PHONE,           
    NVL(TO_CHAR(EMAIL), ' ') AS EMAIL,          
    NVL(TO_CHAR(SECRET_QID1), ' ') AS SECRET_QID1,       
    NVL(TO_CHAR(SECRET_AID1), ' ') AS SECRET_AID1,       
    NVL(TO_CHAR(SECRET_QID2), ' ') AS SECRET_QID2,       
    NVL(TO_CHAR(SECRET_AID2), ' ') AS SECRET_AID2,       
    NVL(TO_CHAR(ADDRESS), ' ') AS ADDRESS,           
    NVL(TO_CHAR(PROVINCE_ID), ' ') AS PROVINCE_ID,       
    NVL(TO_CHAR(DISTRICT_ID), ' ') AS DISTRICT_ID,       
    NVL(TO_CHAR(WARD_ID), ' ') AS WARD_ID,             
    NVL(TO_CHAR(CREATED_DATE, 'rrrrmmdd'), ' ') AS CREATED_DATE,
    NVL(TO_CHAR(CREATED_DATE, 'hh24miss'), ' ') AS CREATED_TIME,
    NVL(TO_CHAR(UPDATED_DATE, 'rrrrmmdd'), ' ') AS UPDATED_DATE,
    NVL(TO_CHAR(UPDATED_DATE, 'hh24miss'), ' ') AS UPDATED_TIME,
    NVL(TO_CHAR(CYCLE_FROM_DATE, 'rrrrmmdd'), ' ') AS CYCLE_FROM_DATE,
    NVL(TO_CHAR(CYCLE_FROM_DATE, 'hh24miss'), ' ') AS CYCLE_FROM_TIME,  
    NVL(TO_CHAR(BIRTHDAY, 'rrrrmmdd'), ' ') AS BIRTHDAY,    
    NVL(TO_CHAR(STATUS), ' ') AS STATUS,            
    NVL(TO_CHAR(WORK_ADDRESS), ' ') AS WORK_ADDRESS,      
    NVL(TO_CHAR(JOB), ' ') AS JOB,               
    NVL(TO_CHAR(IS_VIP), ' ') AS IS_VIP,            
    NVL(TO_CHAR(SERVICE_TYPE), ' ') AS SERVICE_TYPE,      
    NVL(TO_CHAR(OTP_PHONE), ' ') AS OTP_PHONE,         
    NVL(SUBSTR(TO_CHAR(INVOICE_ADDRESS),0, 255), ' ') AS INVOICE_ADDRESS,   
    NVL(TO_CHAR(IS_UPDATED), ' ') AS IS_UPDATED,        
    NVL(TO_CHAR(BALANCE), ' ') AS BALANCE,           
    NVL(TO_CHAR(SYNC_EGAS), ' ') AS SYNC_EGAS,         
    NVL(TO_CHAR(IS_PRINT), ' ') AS IS_PRINT        
from PLXID.customer_bk
WHERE trunc(UPDATED_DATE) between 
to_date(:fromDate, 'rrrrmmdd') and 
to_date(:toDate, 'rrrrmmdd')
`;