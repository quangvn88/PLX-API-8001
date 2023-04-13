exports.QUERY_PLXID_TRANS_LOG =
    `select 
        NVL(TO_CHAR(TRANS_ID), ' ') AS TRANS_ID,         
        NVL(TO_CHAR(PLX_ID), ' ') as PLX_ID,     
        NVL(TO_CHAR(UPDATED_DATE, 'rrrrmmdd'), ' ') as ZZDATE,     
        NVL(TO_CHAR(BANKCARD_ID), ' ') as BANKCARD_ID,      
        NVL(TO_CHAR(MEMBERCARD_ID), ' ') as MEMBERCARD_ID,  
        NVL(TO_CHAR(APP_ID), ' ') as APP_ID,             
        NVL(TO_CHAR(AMOUNT), ' ') as AMOUNT,             
        NVL(TO_CHAR(MONEY), ' ') as MONEY,              
        NVL(TO_CHAR(POINT), ' ') as POINT,              
        NVL(TO_CHAR(TRANS_TYPE), ' ') as TRANS_TYPE,         
        NVL(TO_CHAR(STATUS), ' ') as STATUS,             
        NVL(TO_CHAR(NOTE), ' ') as NOTE,               
        NVL(TO_CHAR(CREATED_DATE, 'rrrrmmdd'), ' ') as CREATED_DATE,       
        NVL(TO_CHAR(CREATED_DATE, 'hh24miss'), ' ') as CREATED_TIME,
        NVL(TO_CHAR(UPDATED_DATE, 'rrrrmmdd'), ' ') as UPDATED_DATE,       
        NVL(TO_CHAR(UPDATED_DATE, 'hh24miss'), ' ') as UPDATED_TIME,
        NVL(TO_CHAR(PAY_TYPE), ' ') as PAY_TYPE,           
        NVL(TO_CHAR(REMAIN_AMOUNT), ' ') as REMAIN_AMOUNT,    
        NVL(TO_CHAR(TRANS_DATE, 'rrrrmmdd'), ' ') as TRANS_DATE,         
        NVL(TO_CHAR(TRANS_DATE, 'hh24miss'), ' ') as TRANS_TIME,         
        NVL(TO_CHAR(STORE_CODE), ' ') as STORE_CODE,         
        NVL(TO_CHAR(REF_NUMBER), ' ') as REF_NUMBER,         
        NVL(TO_CHAR(INVOICE_NUMBER), ' ') as INVOICE_NUMBER,     
        NVL(TO_CHAR(VEHICLE_ID), ' ') as VEHICLE_ID,               
        NVL(TO_CHAR(TXN_ID), ' ') as TXN_ID,             
        NVL(TO_CHAR(STORE_NAME), ' ') as STORE_NAME,         
        NVL(TO_CHAR(PRODUCT_ID), ' ') as PRODUCT_ID,         
        NVL(TO_CHAR(PRODUCT_NAME), ' ') as PRODUCT_NAME,       
        NVL(TO_CHAR(REMAIN_QUANTITY), ' ') as REMAIN_QUANTITY,    
        NVL(TO_CHAR(PRODUCT_QUANTITY), ' ') as PRODUCT_QUANTITY,   
        NVL(TO_CHAR(COMP_CODE), ' ') as COMP_CODE     
    from PLXID.TRANS_LOG
    where trunc(UPDATED_DATE) BETWEEN to_date(:fromDate, 'rrrrmmdd')
    and to_date(:toDate, 'rrrrmmdd')`; 
    // and trans_id = 7022765`;        

exports.QUERY_PLXID_TRANS_LOG_DELETED =
    `select 
        NVL(TO_CHAR(TRANS_ID), ' ') AS TRANS_ID,         
        NVL(TO_CHAR(PLX_ID), ' ') as PLX_ID,     
        NVL(TO_CHAR(UPDATED_DATE, 'rrrrmmdd'), ' ') as ZZDATE,     
        NVL(TO_CHAR(BANKCARD_ID), ' ') as BANKCARD_ID,      
        NVL(TO_CHAR(MEMBERCARD_ID), ' ') as MEMBERCARD_ID,  
        NVL(TO_CHAR(APP_ID), ' ') as APP_ID,             
        NVL(TO_CHAR(AMOUNT), ' ') as AMOUNT,             
        NVL(TO_CHAR(MONEY), ' ') as MONEY,              
        NVL(TO_CHAR(POINT), ' ') as POINT,              
        NVL(TO_CHAR(TRANS_TYPE), ' ') as TRANS_TYPE,         
        NVL(TO_CHAR(STATUS), ' ') as STATUS,             
        NVL(TO_CHAR(NOTE), ' ') as NOTE,               
        NVL(TO_CHAR(CREATED_DATE, 'rrrrmmdd'), ' ') as CREATED_DATE,       
        NVL(TO_CHAR(CREATED_DATE, 'hh24miss'), ' ') as CREATED_TIME,
        NVL(TO_CHAR(UPDATED_DATE, 'rrrrmmdd'), ' ') as UPDATED_DATE,       
        NVL(TO_CHAR(UPDATED_DATE, 'hh24miss'), ' ') as UPDATED_TIME,
        NVL(TO_CHAR(PAY_TYPE), ' ') as PAY_TYPE,           
        NVL(TO_CHAR(REMAIN_AMOUNT), ' ') as REMAIN_AMOUNT,    
        NVL(TO_CHAR(TRANS_DATE, 'rrrrmmdd'), ' ') as TRANS_DATE,         
        NVL(TO_CHAR(TRANS_DATE, 'hh24miss'), ' ') as TRANS_TIME,         
        NVL(TO_CHAR(STORE_CODE), ' ') as STORE_CODE,         
        NVL(TO_CHAR(REF_NUMBER), ' ') as REF_NUMBER,         
        NVL(TO_CHAR(INVOICE_NUMBER), ' ') as INVOICE_NUMBER,     
        NVL(TO_CHAR(VEHICLE_ID), ' ') as VEHICLE_ID,               
        NVL(TO_CHAR(TXN_ID), ' ') as TXN_ID,             
        NVL(TO_CHAR(STORE_NAME), ' ') as STORE_NAME,         
        NVL(TO_CHAR(PRODUCT_ID), ' ') as PRODUCT_ID,         
        NVL(TO_CHAR(PRODUCT_NAME), ' ') as PRODUCT_NAME,       
        NVL(TO_CHAR(REMAIN_QUANTITY), ' ') as REMAIN_QUANTITY,    
        NVL(TO_CHAR(PRODUCT_QUANTITY), ' ') as PRODUCT_QUANTITY,   
        NVL(TO_CHAR(COMP_CODE), ' ') as COMP_CODE  
    from PLXID.TRANS_LOG_BK
    where trunc(UPDATED_DATE) BETWEEN to_date(:fromDate, 'rrrrmmdd')
    and to_date(:toDate, 'rrrrmmdd')`;