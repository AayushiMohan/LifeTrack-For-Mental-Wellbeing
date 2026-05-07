const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// ─── CHAT ROUTE ───────────────────────────────────────────
router.post("/", async (req, res) => {
  const userMessage = req.body.message?.toLowerCase().trim() || "";
  let reply = "";
  let category = "general";

  // ── GREETINGS ──
  if (userMessage.match(/^(hi|hello|hey|hii|helo|sup|yo)$/)) {
    reply = "Hey there 🌿 I'm your LifeTrack wellness companion. How are you feeling today? You can share anything-stress, sleep issues, sadness, anxiety, or just talk.";
    category = "greeting";
  }

  // ── STRESS ──
  else if (userMessage.includes("stress") || userMessage.includes("stressed") || userMessage.includes("overwhelmed") || userMessage.includes("pressure")) {
    reply = `I hear you. Stress can feel really heavy 💙

Here are a few things that genuinely help:
 Try box breathing — inhale 4 sec, hold 4, exhale 4, hold 4. Repeat 4 times.
 Write down the 3 biggest things stressing you. Just naming them reduces their power.
 Take a walk away from your screen.
 Do something that makes you feel good and confident about yourself.
 Remind yourself: you don't have to solve everything today.
Would you like to talk more about what's stressing you? I'm here 🌿`;
    category = "stress";
  }

  // ── ANXIETY ──
  else if (userMessage.includes("anxious") || userMessage.includes("anxiety") || userMessage.includes("panic") || userMessage.includes("nervous") || userMessage.includes("worried") || userMessage.includes("worry")) {
    reply = `I know it feel so exhausting — your feelings are valid 🤍
Try this right now:
- Look around and name 5 things you can see, 4 you can touch, 3 you can hear. This grounds you instantly.
- Take 3 slow deep breaths.
- Remind yourself: this feeling is temporary. It will pass.
What's making you feel anxious? Sometimes saying it out loud (or typing it) makes it smaller 💬`;
    category = "anxiety";
  }

  // ── SADNESS ──
  else if (userMessage.includes("sad") || userMessage.includes("cry") || userMessage.includes("crying") || userMessage.includes("upset") || userMessage.includes("depressed") || userMessage.includes("depression") || userMessage.includes("unhappy")) {
    reply = `I'm really glad you reached out. Feeling sad is not weakness — it takes courage to acknowledge it 💛

A few gentle reminders:
- It's okay to cry. Let it out — holding it in is harder.
- You don't have to feel better immediately. Give yourself time.
- Try to do one small thing today that you normally enjoy, even if it feels hard.
- If this sadness has been lasting for weeks, please consider sharing about this with your friends and i am here if you want to talk. You deserve real support.

I'm here with you. Do you want to tell me more about what's going on? 🌸`;
    category = "sadness";
  }

  // ── LONELINESS ──
  else if (userMessage.includes("lonely") || userMessage.includes("alone") || userMessage.includes("no one") || userMessage.includes("nobody") || userMessage.includes("isolated")) {
    reply = `Feeling lonely is one of the hardest things — and you are not alone in feeling this way 💙

Some things that can help:
- Reach out to one person today, even just a simple "hey, how are you?" text.
- Join an online community around something you love — music, books, wellness, anything.
- Sometimes loneliness is your mind telling you it needs connection. Honor that need.
- Even spending 10 minutes in a coffee shop or park can ease the feeling.

I'm here and I'm listening. What's been making you feel this way? 💬`;
    category = "loneliness";
  }

  // ── SLEEP ──
  else if (userMessage.includes("sleep") || userMessage.includes("insomnia") || userMessage.includes("can't sleep") || userMessage.includes("tired") || userMessage.includes("exhausted") || userMessage.includes("fatigue")) {
    reply = `Sleep struggles are so common but they really affect everything 😴

Try these tonight:
- No screens 30 minutes before bed — yes, including your phone.
- Keep your room cool and dark.
- Write a short brain dump before sleeping — empty your thoughts onto paper.
- Try the 4-7-8 breathing: inhale 4 sec, hold 7, exhale slowly for 8.
- Wake up at the same time every day, even weekends — this resets your body clock.

How long has sleep been difficult for you? 🌙`;
    category = "sleep";
  }

  // ── MOTIVATION ──
  else if (userMessage.includes("motivat") || userMessage.includes("lazy") || userMessage.includes("procrastinat") || userMessage.includes("can't focus") || userMessage.includes("no energy") || userMessage.includes("unmotivated")) {
    reply = `Lack of motivation is often your mind's way of saying it's overloaded or needs rest 🌱

Try this:
- Start with just 2 minutes. Seriously — just 2 minutes of the task. Often you'll keep going.
- Remove one distraction from your environment right now.
- Break your goal into the smallest possible next step.
- Celebrate tiny wins — they build real momentum.
- Ask yourself: am I tired, hungry, or burned out? Sometimes rest IS the productive choice.

What's the one thing you've been putting off? Let's work through it together 💪`;
    category = "motivation";
  }

  // ── ANGER ──
  else if (userMessage.includes("angry") || userMessage.includes("anger") || userMessage.includes("frustrated") || userMessage.includes("furious") || userMessage.includes("rage") || userMessage.includes("irritated")) {
    reply = `Anger is a valid emotion — it usually means something important to you was crossed 🔥

Before reacting:
- Step away for 5 minutes. Seriously — just 5 minutes changes everything.
- Take 3 long, slow exhales. Your nervous system actually calms down.
- Write what you're feeling without filtering — just get it out on paper, not on the person.
- Ask: what is this anger really about? Is it hurt? Disrespect? Feeling unheard?

Once you're calmer, the right response will come naturally. Want to talk about what happened? 💬`;
    category = "anger";
  }

  // ── RELATIONSHIP / FAMILY ──
  else if (userMessage.includes("relationship") || userMessage.includes("breakup") || userMessage.includes("heartbreak") || userMessage.includes("family") || userMessage.includes("parents") || userMessage.includes("partner") || userMessage.includes("boyfriend") || userMessage.includes("girlfriend") || userMessage.includes("divorce") || userMessage.includes("fight with")) {
    reply = `Relationship pain is some of the deepest pain there is 💔

A few things to hold onto:
- Your feelings in this situation are completely valid.
- You cannot control others — only how you respond and what you choose for yourself.
- Give yourself time. Healing from relationship pain is not linear.
- Talking to a trusted friend or counselor can help more than you expect.
- Try not to make big decisions when emotions are at their peak.

Do you want to share more about what's happening? I'm listening with no judgment 🌸`;
    category = "relationship";
  }

  // ── WORK / STUDIES ──
  else if (userMessage.includes("work") || userMessage.includes("job") || userMessage.includes("career") || userMessage.includes("study") || userMessage.includes("exam") || userMessage.includes("college") || userMessage.includes("university") || userMessage.includes("fail") || userMessage.includes("boss") || userMessage.includes("deadline")) {
    reply = `Work and study pressure can feel never ending — I understand 📚

Some things that actually help:
- Use the 2 minute rule: if it takes less than 2 minutes, do it now.
- Time block your day: focused work, then real breaks. No mixing.
- Talk to someone at work or school you trust about how you're feeling.
- Remember: one bad exam, one hard week, one difficult job does not define you.
- If burnout is real, rest is not laziness — it's necessary maintenance.

What specifically is weighing on you right now? 💬`;
    category = "work_study";
  }

  // ── SELF WORTH / CONFIDENCE ──
  else if (userMessage.includes("worthless") || userMessage.includes("useless") || userMessage.includes("failure") || userMessage.includes("hate myself") || userMessage.includes("not good enough") || userMessage.includes("confidence") || userMessage.includes("insecure")) {
    reply = `Please hear this: you are not worthless. Not even close 💙

What you're feeling right now is a thought — not a fact. And thoughts can be changed.

- Write down 3 things you have done in your life that took courage, big or small.
- Speak to yourself like you would speak to a close friend going through this.
- Limit time with people or content that makes you feel small.
- You are a work in progress — and that is perfectly okay.

If these feelings are very intense or have lasted a long time, please consider speaking to a professional. You deserve real support, not just survival.

I believe in you. Tell me more if you want 🌿`;
    category = "self_worth";
  }

  // ── CRISIS / SELF HARM ──
  else if (userMessage.includes("suicide") || userMessage.includes("end my life") || userMessage.includes("kill myself") || userMessage.includes("self harm") || userMessage.includes("hurt myself") || userMessage.includes("don't want to live") || userMessage.includes("want to die")) {
    reply = `I'm really glad you're here and talking. Please know that what you're feeling right now is temporary, even if it doesn't feel that way 💙

You matter. Your life matters.

Please reach out right now:
- iCall India: 9152987821
- Vandrevala Foundation: 1860-2662-345 (24/7)
- AASRA: 9820466627
- Or go to your nearest hospital if you feel unsafe.

I'm here with you right now. You don't have to face this alone. Can you tell me where you are and if you're safe? 🙏`;
    category = "crisis";
  }

  // ── POSITIVE / HAPPY ──
  else if (userMessage.includes("happy") || userMessage.includes("great") || userMessage.includes("amazing") || userMessage.includes("wonderful") || userMessage.includes("good") || userMessage.includes("better") || userMessage.includes("grateful")) {
    reply = `That genuinely makes me so happy to hear 🌟

Hold onto that feeling. A few ways to make it last:
- Write down what made today good — your brain will seek more of it.
- Share your good energy with someone today.
- Keep doing whatever you did today that worked.

You deserve good days 🌸 Keep going!`;
    category = "positive";
  }

  // ── FEEDBACK TRIGGER ──
  else if (userMessage.includes("feedback") || userMessage.includes("not helpful") || userMessage.includes("didn't help") || userMessage.includes("useless") || userMessage.includes("contact") || userMessage.includes("email") || userMessage.includes("talk to someone real") || userMessage.includes("speak to human")) {
    reply = `Thank you for being honest — your feedback truly matters 🙏

If you feel I wasn't able to help enough, or you'd like to share your thoughts, problem, or experience with a real person, please email us directly:

📧 your-email@gmail.com

We read every message and we genuinely care about what you're going through. You can share anything — your story, what you needed, or just how you're feeling.

You can also use the feedback form below 👇 Type: "send feedback" to open it.`;
    category = "feedback";
  }

  // ── SEND FEEDBACK FORM ──
  else if (userMessage.includes("send feedback") || userMessage.includes("open feedback") || userMessage.includes("give feedback")) {
    reply = `SHOW_FEEDBACK_FORM`;
    category = "feedback_form";
  }

  // ── DEFAULT ──
  else {
    reply = `I'm here and I'm listening 💬

I may not have the perfect words for everything, but I genuinely want to help. You can tell me about:
- Stress or anxiety
- Sadness or loneliness  
- Sleep issues
- Relationship problems
- Work or study pressure
- Motivation or confidence

Or just type how you're feeling and we'll figure it out together 🌿

If you'd rather talk to a real person, type "feedback" and I'll share how to reach us directly.`;
    category = "default";
  }

  res.json({ reply, category });
});

// ─── FEEDBACK / EMAIL ROUTE ───────────────────────────────
router.post("/feedback", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  // ── Configure your email below ──
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",        // ← your Gmail here
      pass: "your-gmail-app-password"       // ← Gmail App Password (not your real password)
    }
  });

  const mailOptions = {
    from: email,
    to: "your-email@gmail.com",             // ← where you receive feedback
    subject: `LifeTrack Feedback from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Feedback sent successfully ✅ We will get back to you soon." });
  } catch (err) {
    console.log("Email error:", err);
    res.status(500).json({ message: "Could not send feedback. Please try emailing us directly." });
  }
});

module.exports = router;