import { Hono } from "hono";
import { renderer } from "./renderer";
import OpenAI from "openai";
import { env } from "hono/adapter";
import { useRequestContext } from "hono/jsx-renderer";
import { Suspense } from "hono/jsx";

const PROMPT = (keyword: string) =>
	[
		{
			role: "system",
			content: `You will be provided with a specific keyword, and your task is to generate LP website for promoting the keyword.
			You have to response only as a HTML code.
			Please follow the following instructions:
				1. You have to omit doctype HTML statement
				2. You have to generate code inside of body element
				3. You have to omit markdown related code such as "\`\`\`html"
				4. You must not generate customer review contents
				5. You have to generative attractive and fascinating LP
				6. The generated LP must be resoponsible design
				7. You have generate LP in Japanese
				`,
		},
		{
			role: "user",
			content: keyword,
		},
	] satisfies OpenAI.Chat.ChatCompletionMessageParam[];

const app = new Hono();

app.use(renderer);

const ContentComponent = async () => {
	const c = useRequestContext();

	const { OPENAI_ORG_ID, OPENAI_API_KEY } = env<{
		OPENAI_ORG_ID: string;
		OPENAI_API_KEY: string;
	}>(c);

	const openai = new OpenAI({
		organization: OPENAI_ORG_ID,
		apiKey: OPENAI_API_KEY,
	});

	const chatResponse = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: PROMPT("Sony MDR-MV1"),
	});

	console.log("res: %o", chatResponse);

	if (chatResponse.choices[0].message.content === null) {
		return <div>Something went wrong...</div>;
	}

	const generatedHtml = chatResponse.choices[0].message.content;
	return (
		<div
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: generatedHtml }}
		/>
	);
};

app.get("/", async (c) => {
	return c.render(
		<Suspense fallback={<div>Loading...</div>}>
			<ContentComponent />
		</Suspense>,
	);
});

export default app;
