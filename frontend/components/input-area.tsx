"use client";
import { MantineSize, Stack, Textarea } from "@mantine/core";
import { KeyboardEvent, useState } from "react";
import DotsLoading from "./dots-loading";

interface InputAreaProps {
  size?: MantineSize | (string & {});
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  disabled?: boolean;
  loading?: boolean;
  onSubmit: (value: string) => void;
}

function InputArea(props: InputAreaProps) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        props.onSubmit(value);
        setValue("");
      }
    }
  };

  return (
    <Stack className="px-4 py-1 w-full max-w-2xl rounded-2xl bg-gray-100">
      {!props.loading ? (
        <Textarea
          variant="unstyled"
          size={props.size}
          placeholder={props.placeholder}
          autosize
          minRows={props.minRows}
          maxRows={props.maxRows}
          disabled={props.disabled}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <Stack
          className="w-min h-min p-1 py-4"
          h={17 + 25 * (props.minRows || 1)}
        >
          <DotsLoading />
        </Stack>
      )}
    </Stack>
  );
}

export default InputArea;
