import * as Popover from "@radix-ui/react-popover";
import { List } from "lucide-react";
import { useState } from "react";

type SearchBarProps = {
  onFilterToggle: () => void;
  isFilterOpen: boolean;
};

export default function SearchBar({
  onFilterToggle,
  isFilterOpen,
}: SearchBarProps) {
  const options = [
    { label: "Property", value: "Property" },
    { label: "Name", value: "Name" },
    { label: "Rental Yield", value: "Rental Yield" },
  ];
  const [selected, setSelected] = useState("Property");
  return (
    <div
      data-role="sticky"
      className="bg-beige z-10 py-3 my-2 ml-5 mr-5 sm:py-5 sm:my-4 top-80 text-black"
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={onFilterToggle}
          className="bg-moss-500 hover:bg-moss-600 text-info items-center justify-center whitespace-nowrap font-semibold transition-colors disabled:pointer-events-none cursor-pointer bg-component-textfield border-[1px] border-transparent hover:border-white h-[52px] rounded-[8px] px-6 py-[14px] w-[224px] text-base font-inter rounded-8 hidden sm:flex"
          type="button"
        >
          <div className="flex items-center">
            <span className="font-semibold text-beige-100">
              {isFilterOpen ? "Hide Filters" : "Show Filters"}{" "}
          
            </span>
          </div>
        </button>
        <button
          className="items-center justify-center whitespace-nowrap font-semibold transition-colors disabled:pointer-events-none cursor-pointer bg-component-textfield border-[1px] border-transparent hover:border-white rounded-[8px] px-5 py-[11px] text-text-linkBase text-sm !font-semibold sm:text-base h-[52px] shrink-0 hidden sm:inline-block !hidden"
          type="button"
        >
          Reset Filter
        </button>
        <div
          aria-disabled="false"
          className="bg-moss-500 flex items-center justify-between border-[1px] bg-component-textfield text-info-lighten1 disabled:cursor-not-allowed disabled:bg-component-textfieldDisable text-sm h-[44px] gap-2 rounded-[8px] px-[20px] py-[10px] sm:text-base sm:h-[52px] sm:gap-3 sm:px-[24px] sm:py-3.5 border-transparent flex-1 rounded-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="none"
            viewBox="0 0 20 20"
            className=" [&amp;_path]:fill-current text-size-20 cursor-pointer text-info-lighten3"
          >
            <g clip-path="url(#search-l_svg__a)">
              <path
                fill="#CED3DB"
                fill-rule="evenodd"
                d="M15 9A6 6 0 1 1 3 9a6 6 0 0 1 12 0m-1.417 5.29a7 7 0 1 1 .707-.707l3.564 3.563a.5.5 0 1 1-.707.708z"
                clip-rule="evenodd"
              ></path>
            </g>
            <defs>
              <clipPath id="search-l_svg__a">
                <path fill="#fff" d="M0 0h20v20H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <input
            placeholder="Search"
            aria-disabled="false"
            className="text-beige-100 flex-1 w-0 min-w-20 border-none bg-transparent text-info placeholder:text-info-disable focus-visible:outline-none disabled:cursor-not-allowed disabled:text-info-lighten2 text-left"
            value=""
          />
        </div>

        <Popover.Root>
          {/* Trigger Button */}
          <Popover.Trigger asChild>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded="true"
              className="
            py-4 px-3 sm:px-6
            h-[44px] sm:h-[52px]
            flex items-center justify-between shrink-0
            text-base font-inter font-medium
            text-info bg-component-textfield
            rounded-lg bg-moss-500 hover:bg-moss-600
            text-beige-100
          "
            >
              <div className="flex items-center font-semibold">
                <List className="w-5 h-5 text-info sm:mr-3" />
                <span className="hidden sm:inline">{selected}</span>
              </div>
            </button>
          </Popover.Trigger>

          {/* Popover Content */}
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="start"
              className="
            z-[1050] py-2 relative cursor-pointer
            min-w-60 rounded-lg border border-border
            bg-component-pop shadow-md
            overflow-hidden
            w-[180px] sm:w-[280px]
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:zoom-in-95
            data-[side=bottom]:slide-in-from-top-2
          "
            >
              <div className="flex flex-col max-h-[300px] overflow-y-auto overflow-x-hidden">
                {options.map((opt) => (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={selected === opt.value}
                    onClick={() => setSelected(opt.value)}
                    className={`
                  relative flex items-center justify-between
                  px-6 py-3 cursor-pointer
                  hover:bg-component-menuHover active:bg-component-menuClick bg-beige-100 text-black hover:bg-beige-300
                  ${selected === opt.value ? "text-primary" : ""}
                `}
                  >
                    <span className="w-full">{opt.label}</span>
                    {selected === opt.value && (
                      <span className="ml-3 w-2 h-2 rounded-full bg-primary"></span>
                    )}
                  </div>
                ))}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}
