import GoogleMap from "./GoogleMap";

type PropType = {
    id: string; // e.g., "Texas"
}

export default function StateDetails({ id }: PropType) {

    return (
        <div style={{ padding: '10px' }}>
            <h3>University Search: {id}</h3>
        </div>
    );
}




{/* <div className="h-[600px]">
    <GoogleMap state={decodeURIComponent(id).split(" ").join("+")} zoom={6} query="graduate and undergraduate"/>
</div> */}