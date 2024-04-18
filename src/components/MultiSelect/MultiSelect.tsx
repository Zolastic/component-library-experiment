"use client";

import React from "react";

import { Tag } from "../Tag/Tag";
import { Command, CommandGroup, CommandItem, CommandProps } from "./Command";
import { Command as CommandPrimitive } from "cmdk";

import "../styles.css";
import { cn } from "../../lib/utils";

interface MultiSelectItem {
  value: string;
  label: string;
}

interface MultiSelectProps extends CommandProps {
  items: MultiSelectItem[];
  selectedItems?: MultiSelectItem[];
  placeholderText?: string;
  notFoundText?: string;
  badgeVariant?: "default" | "primary" | "secondary";
  tagClassName?: string;
  width?: React.CSSProperties["width"];
  inputHeight?: React.CSSProperties["height"];
  dropdownMaxHeight?: React.CSSProperties["height"];
  inputScrollable?: boolean;
  maxSelectedItems?: number;
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  defaultOpen?: boolean;
  onMaxSelected?: (maxLimit: number) => void;
  onSelectItem?: (item: MultiSelectItem) => void;
  onUnselectItem?: (item: MultiSelectItem) => void;
  onOpen?: (open: boolean) => void;
}

const MultiSelect = ({
  items,
  selectedItems,
  placeholderText = "Select items...",
  badgeVariant = "default",
  tagClassName = "",
  width = "512px",
  inputHeight = "40px",
  dropdownMaxHeight = "384px",
  inputScrollable = false,
  maxSelectedItems = Number.MAX_SAFE_INTEGER,
  hidePlaceholderWhenSelected = false,
  disabled = false,
  defaultOpen = false,
  onMaxSelected,
  onSelectItem,
  onUnselectItem,
  onOpen,
}: MultiSelectProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(defaultOpen);
  const [selected, setSelected] = React.useState<MultiSelectItem[]>(
    selectedItems ?? []
  );
  const [selectables, setSelectables] = React.useState<MultiSelectItem[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (item: MultiSelectItem) => {
      if (!disabled) {
        setSelected((prev) => prev.filter((s) => s.value !== item.value));
        if (onUnselectItem) {
          onUnselectItem(item);
        }
      }
    },
    [disabled, onUnselectItem]
  );

  const handleSelect = React.useCallback(
    (item: MultiSelectItem) => {
      if (disabled) return;
      if (selected.length >= maxSelectedItems) {
        if (onMaxSelected) {
          onMaxSelected(maxSelectedItems);
        }
        return;
      }
      setSelected((prev) => [...prev, item]);
      if (onSelectItem) {
        onSelectItem(item);
      }
    },
    [maxSelectedItems, onMaxSelected, onSelectItem, selected]
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
    if (selectedItems) {
      setSelected(selectedItems);
    }
  }, [selectedItems]);

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
        className={`
        rounded-lg border border-grey-300 bg-white px-3 py-2 text-sm 
        ring-offset-grey-300 placeholder:text-grey focus:outline-none 
        focus:ring-2 focus:ring-primary focus:ring-opacity-20 
        focus:border-primary-active
        ${disabled ? "cursor-not-allowed opacity-50 bg-grey-100" : ""}
        [&>span]:line-clamp-1 zolastic-component-library-experiment-select-content
      `}
        style={{
          height: inputScrollable ? inputHeight : "auto",
          overflow: inputScrollable ? "auto" : "hidden",
        }}
        data-disabled={disabled}
      >
        <div className="flex gap-1 flex-wrap">
          {selected.map((item) => {
            return (
              <Tag
                key={item.value}
                variant={badgeVariant}
                className={cn(tagClassName)}
                closeable
                onClose={() => handleUnselect(item)}
              >
                {item.label}
              </Tag>
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
            className={`
            ml-2 bg-transparent outline-none placeholder:text-grey-400 flex-1
            ${disabled ? "cursor-not-allowed" : ""}
          `}
            disabled={disabled}
            data-disabled={disabled}
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div
            className={`absolute w-full z-10 top-0 rounded-md border bg-popover text-text-default shadow-md outline-none animate-in max-h-96 overflow-y-auto zolastic-component-library-experiment-select-content ${
              disabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            style={{
              maxHeight: dropdownMaxHeight,
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
                    className={
                      disabled ? "cursor-not-allowed" : "cursor-pointer"
                    }
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

export { MultiSelect, MultiSelectItem, MultiSelectProps };
