import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href = "", children }) => {
      const external = href.startsWith("http");
      if (external) {
        return (
          <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-primary">
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className="font-semibold text-primary">
          {children}
        </Link>
      );
    },
    ...components,
  };
}
