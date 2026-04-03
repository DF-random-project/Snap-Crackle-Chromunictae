import { ok, badRequest } from 'wix-http-functions';
import {getSecret} from 'wix-secrets-backend';
import {fetch} from 'wix-fetch';

export async function post_slackEvent(request){
    const body = await request.body.json();

    if(body.challenge){
        return ok({body: {"challenge":body.challenge}});
    }

    const event = body.event;

    if(event && event.type === "message" && !event.bot_id){
        const token = await getSecret("SLACK_BOT_TOKEN");

        const slackResponse = {
            channel: "C0AQLA338H1",
            text: `you just said: "${event.text}"`,

        };

        await fetch("https://slack.com/api/chat.postMessage",{
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(slackResponse),
        });

        return ok();
    }
    return ok({body: "Message Recived!"});
}