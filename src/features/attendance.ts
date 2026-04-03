import { slackApp } from "../index";

interface AttendanceRecord {
  userId: string;
  action: "check-in" | "check-out";
  timestamp: number;
  username?: string;
}

const attendance = async () => {
  // Attendance command
  slackApp.command("/attendance", async ({ context, payload }) => {
    if (!context?.respond) return;
    
    const subcommand = payload.text.trim().split(" ")[0];
    
    switch (subcommand) {
      case "in":
      case "checkin":
        await handleCheckIn(context, payload);
        break;
      case "out":
      case "checkout":
        await handleCheckOut(context, payload);
        break;
      case "status":
        await handleStatus(context, payload);
        break;
      case "help":
      default:
        await showHelp(context);
        break;
    }
  });

  // Quick check-in/out buttons
  slackApp.action("attendance-checkin", async ({ context, action }) => {
    await handleQuickCheckIn(context, action);
  });

  slackApp.action("attendance-checkout", async ({ context, action }) => {
    await handleQuickCheckOut(context, action);
  });
};

async function handleCheckIn(context: any, payload: any) {
  const now = Date.now();
  const record: AttendanceRecord = {
    userId: context.userId,
    action: "check-in",
    timestamp: now,
  };

  // TODO: Store in database/KV store
  console.log("Check-in record:", record);

  await context.respond({
    response_type: "ephemeral",
    text: "✅ Checked in successfully!",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `✅ *Welcome to the workspace!*\n\nYou've successfully checked in at <!date^${Math.floor(now / 1000)}^{time_secs}|${new Date(now).toLocaleTimeString()}>`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "💡 Use `/attendance out` when you're leaving or click the button below",
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Check Out Later",
            },
            action_id: "attendance-checkout",
            style: "danger",
          },
        ],
      },
    ],
  });
}

async function handleCheckOut(context: any, payload: any) {
  const now = Date.now();
  const record: AttendanceRecord = {
    userId: context.userId,
    action: "check-out",
    timestamp: now,
  };

  // TODO: Store in database/KV store
  console.log("Check-out record:", record);

  await context.respond({
    response_type: "ephemeral",
    text: "❌ Checked out successfully!",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `❌ *Thanks for your time today!*\n\nYou've checked out at <!date^${Math.floor(now / 1000)}^{time_secs}|${new Date(now).toLocaleTimeString()}>`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "💡 Use `/attendance in` when you return tomorrow!",
          },
        ],
      },
    ],
  });
}

async function handleStatus(context: any, payload: any) {
  // TODO: Query database/KV store for user's current status and today's records
  
  await context.respond({
    response_type: "ephemeral",
    text: "📊 Your attendance status",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "📊 *Your Attendance Status*\n\n🔍 _Status tracking coming soon!_\n\nFor now, you can check in and out using:\n• `/attendance in` - Check in\n• `/attendance out` - Check out",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Check In ✅",
            },
            action_id: "attendance-checkin",
            style: "primary",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Check Out ❌",
            },
            action_id: "attendance-checkout",
            style: "danger",
          },
        ],
      },
    ],
  });
}

async function showHelp(context: any) {
  await context.respond({
    response_type: "ephemeral",
    text: "📋 Sirsnap Help - Attendance Tracking",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "📋 *Sirsnap Help - Attendance Tracking*",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Available Commands:*\n• `/attendance in` - Check in to the workspace\n• `/attendance out` - Check out of the workspace\n• `/attendance status` - View your current status\n• `/attendance help` - Show this help message",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Quick Actions:*\nUse the buttons below for quick check-in/out:",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Check In ✅",
            },
            action_id: "attendance-checkin",
            style: "primary",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Check Out ❌",
            },
            action_id: "attendance-checkout",
            style: "danger",
          },
        ],
      },
    ],
  });
}

async function handleQuickCheckIn(context: any, action: any) {
  const now = Date.now();
  const record: AttendanceRecord = {
    userId: action.user.id,
    action: "check-in",
    timestamp: now,
  };

  console.log("Quick check-in record:", record);

  await context.respond({
    response_type: "ephemeral",
    text: "✅ Quick check-in successful!",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `✅ *Quick Check-In Complete!*\n\nWelcome back, <@${action.user.id}>!\n\n_Checked in at: <!date^${Math.floor(now / 1000)}^{time_secs}|${new Date(now).toLocaleTimeString()}>_`,
        },
      },
    ],
  });
}

async function handleQuickCheckOut(context: any, action: any) {
  const now = Date.now();
  const record: AttendanceRecord = {
    userId: action.user.id,
    action: "check-out",
    timestamp: now,
  };

  console.log("Quick check-out record:", record);

  await context.respond({
    response_type: "ephemeral",
    text: "❌ Quick check-out successful!",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `❌ *Quick Check-Out Complete!*\n\nThanks for your time, <@${action.user.id}>!\n\n_Checked out at: <!date^${Math.floor(now / 1000)}^{time_secs}|${new Date(now).toLocaleTimeString()}>_`,
        },
      },
    ],
  });
}

export default attendance;