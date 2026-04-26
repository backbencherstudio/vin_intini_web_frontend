import Image from "next/image";
import GoogleMap from "./GoogleMap";

type PropType = {
    id: string; // e.g., "Texas"
}

export default function StateDetails({ id }: PropType) {

    return (
        <div className="p-6">
            <Image 
                src="/images/googlemap.png"
                alt="Google Map"
                width={800}
                height={600}
                className="w-full h-full rounded-2xl"
            />
        </div>
    );
}




{/* <div className="h-[600px]">
    <GoogleMap state={decodeURIComponent(id).split(" ").join("+")} zoom={6} query="graduate and undergraduate"/>
</div> */}