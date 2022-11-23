const formatDataForNestedTable = (results, key) => {
    const formattedResult = [];
    results.forEach(res=>{
        if(res.displaySubOrder > 0){
            formattedResult[formattedResult.length - 1] = {
                ...formattedResult[formattedResult.length - 1],
                children: [
                    ...(formattedResult[formattedResult.length - 1].children || []),
                    res
                ]
            }
        }else{
            formattedResult.push({...res, id: res[key]})
        }
    })
    return formattedResult;
}

export default formatDataForNestedTable;