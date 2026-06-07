import { Facebook, Instagram, Twitter } from "lucide-react";
import { IoMailSharp } from "react-icons/io5";
import { MdCall } from "react-icons/md";

function ContactInfo() {
  return (
    <div>
      <div className="w-full   p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl lg:text-5xl font-semibold mb-8">
            Get in Touch
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className=" p-2 bg-white rounded-full">
                <IoMailSharp className=" text-secondaryColor" />
              </div>
              <span className="text-gray-600">elisabeth_sarah@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <div className=" p-2 bg-white rounded-full">
                <MdCall size={18} className="  text-secondaryColor " />
              </div>
              <span className="text-gray-600">+6726 664 074</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <a
            href="#"
            className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white"
          >
            <Facebook size={18} />
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white"
          >
            <Instagram size={18} />
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white"
          >
            <Twitter size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
