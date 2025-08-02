// import { project_items } from "@prisma/client";

// interface EditableInputProps {
//     row: project_items;
//     field: keyof proposal_items;
//     type?: HTMLInputElement["type"];
//     setItems: typeof setProposalItems | typeof setIndirectProposalItems;
//     width?: number;
//   }

// const RenderEditableInput = ({ row, field, type = "text", setItems }: EditableInputProps) => {
//   const [inputValue, setInputValue] = useState(row[field] === null ? "" : row[field]?.toString());

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleInputChange(row.id, field, inputValue, setItems);
//     }
//   };

//   const handleBlur = () => {
//     handleInputChange(row.id, field, inputValue, setItems);
//   };

//   return (
//     <div className="flex items-center gap-2 w-full">
//       <Input
//         type={type}
//         className={`${!row[field] ? "border-red-500" : ""}`}
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         onKeyDown={handleKeyDown}
//         onBlur={handleBlur}
//       />
//     </div>
//   );
// };
