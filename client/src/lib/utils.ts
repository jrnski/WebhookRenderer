import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatJson(json: any): string {
  // Convert JSON to string with indentation
  const jsonString = JSON.stringify(json, null, 2);
  
  // Add syntax highlighting with spans
  return jsonString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
      let cls = 'text-blue-500'; // json-number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-rose-500'; // json-key
          // Remove the colon from the matched string for highlighting
          match = match.substring(0, match.length - 1);
          return `<span class="${cls}">${match}</span>:`;
        } else {
          cls = 'text-green-500'; // json-string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-purple-500'; // json-boolean
      } else if (/null/.test(match)) {
        cls = 'text-gray-500'; // json-null
      }
      return `<span class="${cls}">${match}</span>`;
    });
}
