import Skeleton from 'react-loading-skeleton';

export default function NemoSkeleton({children, ...rest}){
    return (
        <div style={{width:'100%'}}><Skeleton {...rest} /></div>
    )
}