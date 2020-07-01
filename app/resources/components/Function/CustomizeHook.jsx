import React from "react";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import NoSsr from "@material-ui/core/NoSsr";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import { useEffect } from "react";

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled("div")`
  width: 100%;
  background-color: #fafafa !important;
  border: 1px solid;
  border-color: rgba(0, 0, 0, 0.15) !important;
  border-radius: 4px;
  padding: 10px 15px;
  display: flex;
  flex-wrap: nowrap;

  &:hover {
    // border-color: #40a9ff;
  }

  &.focused {
    // border-color: #40a9ff;
    // box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: #fafafa !important;
    font-size: 13px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: none;
  }
`;

const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    font-size: 13px;
    margin-right: 5px;
    overflow: hidden;
    white-space: nowrap;
    // text-overflow: ellipsis;
  }

  & svg {
    font-size: 13px;
    cursor: pointer;
  }
`;

const Listbox = styled("ul")`
  width: 100%;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;
    align-items: center;
    font-size: 13px;
    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected="true"] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus="true"] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;

const CustomizedHook = ({
  listTag,
  setSelectedTag,
  setSearchTag,
  searchTag,
  selectedTag,
}) => {
  const onChange = (e, value) => {
    setSearchTag(value);
  };

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    multiple: true,
    options: searchTag !== "" ? listTag : [],
    getOptionLabel: (option) =>
      selectedTag.filter((item) => item.tag.includes(option.tag)).length === 0
        ? option.tag
        : "",
    onInputChange: onChange,
    inputValue: searchTag,
  });

  useEffect(() => {
    let ready = true;
    if (ready) {
      setSelectedTag(value);
    }
    return () => {
      ready = false;
      if (ready) {
        setSelectedTag(value);
      }
    };
  }, [value]);
  return (
    <NoSsr>
      <div style={{ position: "relative" }}>
        <div {...getRootProps()}>
          {/* <Label {...getInputLabelProps()}>Customized hook</Label> */}
          <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
            {value.map((option, index) => (
              <Tag label={option.tag} {...getTagProps({ index })} />
            ))}
            <input
              placeholder="Add a tag.."
              value={searchTag}
              {...getInputProps()}
            />
          </InputWrapper>
        </div>
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {value.length < 5 ? (
              groupedOptions.map((option, index) => (
                <li {...getOptionProps({ option, index })}>
                  <span>{option.tag}</span>
                  <CheckIcon fontSize="small" />
                </li>
              ))
            ) : (
              <li>Limit reached</li>
            )}
          </Listbox>
        ) : null}
      </div>
    </NoSsr>
  );
};

export default CustomizedHook;
