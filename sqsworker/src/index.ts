import { receiveMessage } from "./lib/sqs";
import { deleteMessage } from "./lib/sqs";
import { processMessage } from "./lib/utils/processMessage";


const pollMessage = async () => {
    while(true){
        const data: any = await receiveMessage();
        if(data && data.messsage){
            for (const message of data.Message){
                await processMessage(message);
                await deleteMessage(message.Receive)
            }
        }else {
            console.log("No message in queue");
        }

        new Promise((resolve) => setTimeout(resolve, 3000));
    }
}


pollMessage()