import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            color: "rgb(24 24 27)",
            p: {
              lineHeight: "1.75",
            },
            a: {
              color: "rgb(113 113 122)",
              "&:hover": {
                color: "rgb(39 39 42)",
              },
            },
            blockquote: {
              fontStyle: "normal",
              borderLeftWidth: "2px",
              borderLeftColor: "rgb(212 212 216)",
              paddingLeft: "1rem",
              color: "rgb(113 113 122)",
              quotes: "none",
            },
            code: {
              backgroundColor: "rgb(244 244 245)",
              borderRadius: "0.25rem",
              padding: "0.125rem 0.25rem",
              fontWeight: "500",
            },
            "code::before": {
              content: "none",
            },
            "code::after": {
              content: "none",
            },
            pre: {
              backgroundColor: "rgb(244 244 245)",
              borderRadius: "0.375rem",
              padding: "1rem",
              overflow: "auto",
            },
            h1: {
              fontWeight: "600",
              marginTop: "2rem",
              marginBottom: "1.5rem",
            },
            h2: {
              fontWeight: "600",
              marginTop: "1.75rem",
              marginBottom: "1rem",
              paddingBottom: "0",
              borderBottomWidth: "0",
              borderBottomColor: "transparent",
            },
            h3: {
              fontWeight: "600",
              marginTop: "1.5rem",
              marginBottom: "0.75rem",
            },
            img: {
              // 移除所有样式，保持图片原始状态
            },
            ul: {
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            ol: {
              listStyleType: "decimal",
              paddingLeft: "1.5rem",
            },
            "li::marker": {
              color: "rgb(113 113 122)",
            },
            hr: {
              borderColor: "rgb(228 228 231)",
              marginTop: "2rem",
              marginBottom: "2rem",
            },
            table: {
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
            },
            thead: {
              backgroundColor: "rgb(244 244 245)",
            },
            th: {
              padding: "0.75rem 1rem",
              textAlign: "left",
              fontWeight: "600",
              borderBottomWidth: "1px",
              borderBottomColor: "rgb(228 228 231)",
            },
            td: {
              padding: "0.75rem 1rem",
              borderBottomWidth: "1px",
              borderBottomColor: "rgb(228 228 231)",
            },
          },
        },
      },
      gridTemplateColumns: {
        53: 'repeat(53, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
export default config

