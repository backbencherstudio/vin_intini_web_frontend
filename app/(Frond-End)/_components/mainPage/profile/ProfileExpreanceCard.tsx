import { EditeIcon } from "@/public/svgIcons/Icons";

function ProfileExpreanceCard({ item, borderb }: any) {
  return (
    <div>
      {" "}
      <article
        className={`py-4 ${borderb ? "border-b border-borderColor" : ""}`}
      >
        <div className="flex items-start gap-2.5">
          <div className="h-11 w-11 shrink-0 bg-linear-to-br from-cyan-200 to-cyan-500" />
          <div>
            <div className="flex items-center gap-2.5 ">
              <h3 className="text-base font-semibold leading-[1.2] text-descriptionColor">
                {item.companyName}
              </h3>

              <button className="cursor-pointer">
                <EditeIcon className="h-4 w-4 text-descriptionColor" />
              </button>
            </div>
            <p className="mt-1 text-sm text-descriptionColor">
              {item.companyMeta}
            </p>

            <h4 className="mt-4 text-base md:text-lg font-semibold leading-[1.2] text-descriptionColor">
              {item.jobTitle}
            </h4>
            <p className="mt-1 text-sm text-descriptionColor">{item.jobMeta}</p>
            <p className="mt-0.5 text-sm text-descriptionColor">
              {item.location}
            </p>
          </div>
        </div>

        {item.description && (
          <div className="mt-4 pl-13">
            <h5 className="text-sm font-semibold text-descriptionColor">
              Description
            </h5>
            <p className="mt-1.5 text-base leading-[1.45] text-descriptionColor">
              {item.description}
            </p>
          </div>
        )}

        {item.skills.length > 0 && (
          <div className="mt-4 pl-13">
            <h5 className="text-sm font-semibold text-descriptionColor">
              Skills
            </h5>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.skills.map((skill, skillIndex) => (
                <span
                  key={`${item.id}-${skill}-${skillIndex}`}
                  className="rounded-full bg-bgLightColor px-4 py-1.5 text-base font-medium text-headerColor"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

export default ProfileExpreanceCard;
