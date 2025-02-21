import { QuestTemplate } from "@/store/types";
import Constants from "expo-constants";

export const AVAILABLE_QUESTS: QuestTemplate[] = [
  {
    id: "quest-1",
    title: "A Confused Awakening",
    description:
      "Awaken in a dark forest with no memory, as a distant hut beckons through the gloom.",
    durationMinutes: Constants.expoConfig?.extra?.development ? 2 : 3,
    reward: { xp: 100 },
    poiSlug: "darkwood-awakening",
    story: `
      I wake up lying on my back, the earth cold and damp beneath me. The trees stretch high, their gnarled limbs tangled overhead, blotting out the sky. For a long moment, I don’t move. Not because I’m afraid—though maybe I should be—but because I don’t know who I am.
      No name. No memory. Just a dull ache behind my eyes, pulsing like the aftermath of a long-forgotten dream.
      I sit up, slow and deliberate, brushing leaves from my coat. The fabric is worn, torn at the sleeve, though I can’t say if that means anything. Then, a weight in my pocket—a piece of folded parchment. I pull it free, fingers stiff with cold. It’s a map. Or part of one.
      Most of it is blank, save for a crude drawing of trees, a stretch of forest that looks too much like the one around me to be a coincidence. The rest of the map is covered in a shifting black fog, writhing at the edges of my vision, like ink that refuses to dry. I blink, shake my head. The image stays.
      I don’t know what it means. I don’t know what "I" mean.
      But there’s only one thing to do: move. I tuck the map into my coat, push myself to my feet, and take the first step into the unknown.
    `,
  },
  {
    id: "quest-2",
    title: "Shelter of Whispers",
    description:
      "Seek refuge in a modest hut and discover a mysterious map that reveals only your immediate surroundings.",
    durationMinutes: Constants.expoConfig?.extra?.development ? 2 : 10,
    reward: { xp: 120 },
    poiSlug: "hut-of-whispers",
    story: `
      I move through the undergrowth, the brittle branches snapping beneath my boots. The hut appears through the mist like something forgotten—leaning slightly, its wooden door swaying on rusted hinges.
      I step inside. The air is stale, thick with dust and old wood. Whoever was here didn’t take much when they left. There’s no sign of struggle, no overturned furniture. Just absence.
      I find a candle and strike a match. The light flickers, stretching long shadows across the walls. I pull the map from my coat and lay it flat on the table. In the candlelight, faint lines emerge, as if hiding beneath the surface. Scribbled words. A phrase.
      "Balance must be restored."
      A hidden source of power. The idea feels impossibly large, yet familiar.
      The wind picks up outside, rattling the shutters. I can’t tell if it’s exhaustion or something deeper, but the weight of it all drags at me. There’s no point in trying to untangle it tonight. I settle by the fireplace, watching the last embers burn low, the map clutched in my hands.
      Tomorrow, I’ll look for answers.
    `,
  },
  {
    id: "quest-3",
    title: "The Weary Crossing",
    description:
      "Build a makeshift raft and brave a torrential river, emerging on the far shore, breathless and spent.",
    durationMinutes: Constants.expoConfig?.extra?.development ? 2 : 15,
    reward: { xp: 150 },
    poiSlug: "weary-crossing",
    story: `
      By morning, it’s clear—I’m trapped. The river coils around this stretch of land like a noose, its current fast and merciless. The trees behind me stand thick, an impassable wall of roots and thorns. No trails. No way forward. Except through the water.
      I search the remains of the hut, scavenging planks, frayed rope, anything that might hold together long enough to keep me from drowning. My hands work without hesitation, lashing wood with knots that feel second nature. Maybe I was a sailor. Maybe I wasn’t. Doesn’t matter. I need to cross.
      The raft groans as I push it into the shallows. Water swirls around my boots. I step on, crouching low as the current catches hold. The river doesn’t carry—it drags. The world tilts with every surge, the raft lurching beneath me, threatening to come undone.
      I grip the rope, muscles tight, jaw locked. The opposite shore inches closer. A break in the current, and I seize the moment—digging the pole deep, forcing the raft toward land.
      Wood scrapes against rock, the jolt nearly sending me overboard. I scramble onto the bank, breath sharp, hands aching. The raft is already splintering, drifting back into the current.
      I don’t look back.
      The map is still in my coat, damp but intact. I shake off the river’s chill and move inland, deeper into the unknown.
    `,
  },
  {
    id: "quest-4",
    title: "Echoes of the Ancients",
    description:
      "Follow the shoreline to a colossal ancient arch inscribed with cryptic messages that whisper secrets of the past.",
    durationMinutes: Constants.expoConfig?.extra?.development ? 2 : 20,
    reward: { xp: 200 },
    poiSlug: "arch-of-echoes",
    story: `
      The land changes beyond the river. The trees thin, giving way to ruins—broken stones half-swallowed by the earth, the remains of something old, something lost. I follow the path between them, stepping over shattered pillars and roots tangled with the bones of the past. Then, through the mist, I see it.
      A massive arch. Carved from stone so ancient it looks like it was born from the land itself. The surface is worn, cracked by time, but the inscriptions remain—faint spirals and twisting shapes, two forces entwined. One bright as fire, the other deep as a starless void. Opposites, locked together.
      I run my fingers over the carvings, tracing the fading grooves. Then, in the lower corner, half-buried in dust and shadow, I see it.
      My name. I remember it now.
      It’s etched into the stone, as old as the rest. My mind claws for answers, but nothing comes—only the cold realization that this place, this monument, knew me before I knew myself.
      The inscription tells a story: the balance was broken. Light, once free, was trapped. Darkness grew, swallowing everything. The final image is an abyss, stretching endlessly into ruin.
      Something inside me whispers that this isn’t just history. It’s a warning.
      I pick up the map, hands steady now. Whatever this means, whatever it wants me to understand—I have no choice but to keep moving.
    `,
  },
  {
    id: "quest-5",
    title: "The Rugged Outcropping",
    description:
      "Venture inland until you confront a formidable rock crag at the edge of a tranquil lake, forcing you to turn back.",
    durationMinutes: Constants.expoConfig?.extra?.development ? 2 : 25,
    reward: { xp: 250 },
    poiSlug: "rugged-outcropping",
    story: `
      The land slopes upward until I reach the edge of a rocky outcrop. Below, the lake sprawls wide and still. There’s no telling how deep it runs or how far it stretches.
      In the distance, a statue juts from the water. Time and decay have claimed most of its features, but what remains speaks of royalty—strong jaw, the hint of a crown, stone robes weighed heavy with moss. An old ruler, long forgotten. Or maybe not forgotten at all.
      A fresh wave of frustration hits me. My name, carved in ancient stone. A land on the verge of collapse. A king whose shadow still looms. And I’m walking blind through it all. I grip the map, fingers tightening. Useless. A scrap of parchment leading me in circles.
      The urge to toss it into the lake nearly takes me. Just let it sink, let it be done. But I don’t.
      I let out a slow breath, kneeling down at the cliff’s edge. What happened here? What happened to me?
      I don’t have answers, but the map is all I’ve got. I fold it carefully, tucking it into my coat, and rise to my feet. The lake isn’t the way forward. Not yet. I turn back, retracing my steps, determined to find another path.
    `,
  },
];
