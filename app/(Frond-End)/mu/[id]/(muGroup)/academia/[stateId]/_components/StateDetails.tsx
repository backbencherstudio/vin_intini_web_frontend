import GoogleMap from "./GoogleMap";

type PropType = {
    id: string; // e.g., "Texas"
}

export default function StateDetails({ id }: PropType) {
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
    
    // Using 'search' mode ensures Google finds multiple programs in that state
    const query = encodeURIComponent(`Undergrad and Grad Programs in ${id}`);
    const mapSrc = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${query}`;

    return (
        <div style={{ padding: '10px' }}>
            <h3>University Search: {id}</h3>
            {/* <div className="h-[600px]">
                <GoogleMap state={decodeURIComponent(id).split(" ").join("+")} zoom={6} query="graduate and undergraduate"/>
            </div> */}
        </div>
    );
}
