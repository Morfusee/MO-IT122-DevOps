"use client";
import { Group, ScrollArea, Stack, Text } from "@mantine/core";
import { useEffect, useRef } from "react";

function MessageList() {
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight });
    }
  }, [viewport.current]);

  return (
    <ScrollArea className="w-full flex-1" viewportRef={viewport}>
      <UserMessageBubble content="What is the pavlovian theory or something, I can't remember" />
      <LLMMessageBubble
        content={`The theory you're likely thinking of is Pavlovian conditioning, also known as classical conditioning. It's a type of learning where an association is made between two stimuli, resulting in a learned response.   

Here's a breakdown of the key elements:

Unconditioned Stimulus (UCS): A stimulus that naturally and automatically triggers a response without any learning. In Ivan Pavlov's famous experiments with dogs, the UCS was food.   
Unconditioned Response (UCR): The natural and automatic response to the unconditioned stimulus. In Pavlov's experiments, salivation in response to food was the UCR.   
Neutral Stimulus (NS): A stimulus that initially does not elicit a specific response. In Pavlov's experiments, the sound of a bell was initially a neutral stimulus.   
Conditioned Stimulus (CS): A previously neutral stimulus that, after being repeatedly paired with the unconditioned stimulus, eventually triggers a learned response. In Pavlov's experiments, after the bell was repeatedly paired with food, it became the conditioned stimulus.   
Conditioned Response (CR): The learned response to the conditioned stimulus. In Pavlov's experiments, salivation in response to the sound of the bell (without the presence of food) was the conditioned response.   
Pavlov's famous experiments involved dogs and their salivation response to food. He noticed that the dogs would begin to salivate not just when they saw the food, but also when they heard the footsteps of the person who usually fed them. This observation led him to conduct experiments where he paired a neutral stimulus (like the sound of a bell or a metronome) with the presentation of food.   

Over time, the dogs learned to associate the neutral stimulus with the food. Eventually, the neutral stimulus alone (the bell or metronome) was enough to make the dogs salivate, even without the food being present. This demonstrated that a new association had been formed, and a new learned response had been acquired.   

Pavlovian conditioning is a fundamental concept in behavioral psychology and has been shown to influence a wide range of behaviors and emotional responses in both animals and humans. Examples include:   

Taste Aversions: If you eat a certain food and then get sick, you might develop a strong dislike for that food, even if the food wasn't the actual cause of your illness.   
Phobias: Fears can develop through association. For example, if a loud noise (UCS) occurs at the same time as seeing a dog (NS), a person might develop a fear of dogs (CS leading to CR of fear).   
Marketing: Advertisers often pair their products with positive stimuli like attractive people or enjoyable music to create positive associations.   
So, you were on the right track with "Pavlovian theory"! It's a cornerstone of understanding how we learn through associations in our environment.`}
      />
    </ScrollArea>
  );
}

interface UserMessageBubbleProps {
  content: string;
}

function UserMessageBubble(props: UserMessageBubbleProps) {
  return (
    <Group justify="end" className="w-full max-w-2xl mx-auto mb-10">
      <Stack className="px-6 py-3 bg-neutral-300/60 rounded-3xl max-w-2/3">
        <Text>{props.content}</Text>
      </Stack>
    </Group>
  );
}

interface LLMMessageBubbleProps {
  content: string;
}

function LLMMessageBubble(props: LLMMessageBubbleProps) {
  return (
    <Group className="w-full max-w-2xl mx-auto mb-18">
      <Text className="whitespace-pre-wrap">{props.content}</Text>
    </Group>
  );
}

export default MessageList;
