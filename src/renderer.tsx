import { css, Style } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(
	({ children }) => {
		return (
			<html lang="ja">
				<head>
					<Style>{css`
          html {
            font-family: Arial, Helvetica, sans-serif;
          }
					body {
						margin: 0;
					}
        `}</Style>
				</head>
				<body>{children}</body>
			</html>
		);
	},
	{ stream: true },
);
