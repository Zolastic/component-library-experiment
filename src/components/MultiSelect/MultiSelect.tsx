"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "../Badge/Badge";
import { Command, CommandGroup, CommandItem } from "./Command";
import { Command as CommandPrimitive } from "cmdk";

import "../styles.css";

type Item = Record<"value" | "label", string>;

type MultiSelectProps = {
  items: Item[];
  selectedItems?: Item[];
  placeholderText?: string;
  notFoundText?: string;
  badgeVariant?: "default" | "primary" | "secondary";
  width?: React.CSSProperties["width"];
  inputHeight?: React.CSSProperties["height"];
  selectContentMaxHeight?: React.CSSProperties["height"];
  inputScrollable?: boolean;
  maxSelectedItems?: number;
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  onMaxSelected?: (maxLimit: number) => void;
  onSelect?: (value: string) => void;
  onUnselect?: (value: string) => void;
  onOpen?: (open: boolean) => void;
};

const MultiSelect = ({
  items,
  selectedItems,
  placeholderText = "Select items...",
  badgeVariant = "default",
  width = "512px",
  inputHeight = "40px",
  selectContentMaxHeight = "384px",
  inputScrollable = false,
  maxSelectedItems = Number.MAX_SAFE_INTEGER,
  hidePlaceholderWhenSelected = false,
  disabled = false,
  onMaxSelected,
  onSelect,
  onUnselect,
  onOpen,
}: MultiSelectProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Item[]>(selectedItems ?? []);
  const [selectables, setSelectables] = React.useState<Item[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (item: Item) => {
      if (!disabled) {
        setSelected((prev) => prev.filter((s) => s.value !== item.value));
        if (onUnselect) {
          onUnselect(item.value);
        }
      }
    },
    [disabled, onUnselect]
  );

  const handleSelect = React.useCallback(
    (item: Item) => {
      if (disabled) return;
      if (selected.length >= maxSelectedItems) {
        if (onMaxSelected) {
          onMaxSelected(maxSelectedItems);
        }
        return;
      }
      setSelected((prev) => [...prev, item]);
      if (onSelect) {
        onSelect(item.value);
      }
    },
    [maxSelectedItems, onMaxSelected, onSelect, selected]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  React.useEffect(() => {
    setSelectables(
      items.filter((item) => {
        return !selected.some(
          (selectedItem) => selectedItem.value === item.value
        );
      })
    );
  }, [items, selected]);

  React.useEffect(() => {
    if (onOpen) {
      onOpen(open);
    }
  }, [open, onOpen]);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
      style={{ width }}
    >
      <div
        className="rounded-lg border border-grey-300 bg-white px-3 py-2 text-sm 
      ring-offset-grey-300 placeholder:text-grey focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary-active 
      disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:bg-grey-100 data-[disabled]:cursor-not-allowed [&>span]:line-clamp-1 zolastic-component-library-experiment-select-content"
        style={{
          height: inputScrollable ? inputHeight : "auto",
          overflow: inputScrollable ? "auto" : "hidden",
        }}
        data-disabled={disabled}
      >
        <div className="flex gap-1 flex-wrap">
          {selected.map((item) => {
            return (
              <Badge key={item.value} variant={badgeVariant}>
                {item.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[disabled]:cursor-not-allowed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                  data-disabled={disabled}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={
              hidePlaceholderWhenSelected && selected.length > 0
                ? ""
                : placeholderText
            }
            className="ml-2 bg-transparent outline-none placeholder:text-grey-400 flex-1
            data-[disabled]:cursor-not-allowed"
            disabled={disabled}
            data-disabled={disabled}
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div
            className="absolute w-full z-10 top-0 rounded-md border bg-popover text-text-default shadow-md outline-none animate-in max-h-96 overflow-y-auto zolastic-component-library-experiment-select-content"
            style={{
              maxHeight: selectContentMaxHeight,
            }}
          >
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((item) => {
                return (
                  <CommandItem
                    key={item.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={(value) => {
                      handleSelect(item);
                    }}
                    className={"cursor-pointer"}
                  >
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
};

export default MultiSelect;
