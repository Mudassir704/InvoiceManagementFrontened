import axios from 'axios';
import { useEffect, useState } from 'react'

export default function DataService(pageNumber) {
    const [loading, setLoading] = useState(true);
    const [error, setErorr] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setLoading(true);
        setErorr(false);
        let cancel;
        axios({
            method: "GET",
            url: "http://localhost:8080/invoices",
            params: {page: pageNumber},
            cancelToken: new axios.CancelToken(c => cancel = c)})
            .then(res => {
                setInvoices(() => {
                    var resp = res.data;
                    var invoice = [];
                    for(var i = 0;i < pageNumber * 10;i++)
                        invoice.push(resp[i]);
                    return invoice;
                })
                setHasMore(res.data.length > 0)
                setLoading(false);
            })
            .catch(e => {
                if(axios.isCancel(e)) return;
                setErorr(true);
            })
        return () => cancel()
    }, [pageNumber])
    
    return {loading, error, invoices, hasMore};
}
