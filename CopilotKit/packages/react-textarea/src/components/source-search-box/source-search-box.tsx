import { useState } from "react";
import { Command, CommandEmpty, CommandInput, CommandList, CommandSeparator } from "../ui/command";

export interface SourceSearchBoxProps {
  searchTerm: string;
}

export function SourceSearchBox(props: SourceSearchBoxProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");

  return (
    <Command
      className="rounded-lg border shadow-md"
      value={selectedValue}
      onValueChange={(value) => {
        setSelectedValue(value);
      }}
      filter={(value, search) => {
        // if the search term is empty, show all commands
        if (props.searchTerm === "") return 1;

        // if the search term is a prefix of the command, show it
        if (value.startsWith(props.searchTerm)) return 1;

        // otherwise, don't show it
        return 0;
      }}
    >
      <CommandInput
        value={props.searchTerm}
        className="rounded-t-lg hidden"
        placeholder="Search for a command..."
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* <CommandGroup heading="Suggestions">
          <CommandItem
            onSelect={(value) => {
              console.log(value);
              console.log(value);
            }}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup> */}
        <CommandSeparator />
      </CommandList>
    </Command>
  );
}

export function Logo({
  children,
  width,
  height,
}: {
  children: React.ReactNode;
  width: string;
  height: string;
}) {
  return (
    <div className="flex items-center justify-center" style={{ width: width, height: height }}>
      {children}
    </div>
  );
}
