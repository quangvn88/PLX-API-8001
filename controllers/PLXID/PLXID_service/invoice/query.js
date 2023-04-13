exports.QUERY_PLXID_INVOICE =
    `
select     
    NVL(TO_CHAR(COMP_CODE), ' ') AS COMP_CODE,
    NVL(TO_CHAR(STORE_CODE), ' ') AS STORE_CODE,
    NVL(TO_CHAR(PRD_NAME), ' ') AS PRD_NAME,
    NVL(TO_CHAR(PRD_QTY), ' ') AS PRD_QTY,
    NVL(TO_CHAR(AMOUNT), ' ') AS AMOUNT,
    NVL(TO_CHAR(INVOICE), ' ') AS INVOICE,
    NVL(TO_CHAR(TAXID), ' ') AS TAXID,
    NVL(TO_CHAR(NGAYHD, 'rrrrmmdd'), ' ') AS NGAYHD,      
    NVL(TO_CHAR(NGAYHD, 'hh24miss'), ' ') AS TIMEHD,     
    NVL(TO_CHAR(PLX_ID), ' ') AS PLX_ID,
    NVL(TO_CHAR(TRANS_ID), ' ') AS TRANS_ID,
    NVL(TO_CHAR(TXN_ID), ' ') AS TXN_ID,  
    NVL(TO_CHAR(TEN_TO_CHUC), ' ') AS TEN_TO_CHUC    
    from bidata.egas_hoadon
    WHERE trunc(NGAYHD) between 
    to_date(:fromDate, 'rrrrmmdd') and 
    to_date(:toDate, 'rrrrmmdd')
`;