"use client";

import { supabaseClient } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseRealtimeChatProps {
  roomName: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabaseClient.channel> | null>(
    null
  );
  const reconnectTimeoutRef = useRef<number | undefined>(undefined);
  const isSettingUpRef = useRef(false);

  const cleanupChannel = useCallback(() => {
    if (channelRef.current) {
      console.log("Cleaning up channel...");
      supabaseClient.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
    isSettingUpRef.current = false;
  }, []);

  const setupChannel = useCallback(async () => {
    // Prevent multiple simultaneous setup attempts
    if (isSettingUpRef.current) {
      console.log("Channel setup already in progress...");
      return;
    }

    isSettingUpRef.current = true;

    try {
      // First, check if we have a valid session
      const {
        data: { session },
        error: sessionError,
      } = await supabaseClient.auth.getSession();
      if (sessionError) {
        console.error("Session error:", sessionError);
        setError("Authentication error");
        isSettingUpRef.current = false;
        return;
      }

      if (!session) {
        console.log("No active session, attempting to sign in anonymously...");
        const { error: signInError } =
          await supabaseClient.auth.signInWithPassword({
            email: "anonymous@example.com",
            password: "anonymous",
          });

        if (signInError) {
          console.error("Anonymous sign in error:", signInError);
          setError("Failed to establish connection");
          isSettingUpRef.current = false;
          return;
        }
      }

      // Clean up any existing channel before creating a new one
      cleanupChannel();

      const newChannel = supabaseClient.channel(roomName, {
        config: {
          broadcast: { self: true },
        },
      });

      console.log("Channel created, setting up listeners...");

      newChannel
        .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
          console.log("Received message:", payload);
          setMessages((current) => [
            ...current,
            payload.payload as ChatMessage,
          ]);
        })
        .subscribe(async (status) => {
          console.log("Channel subscription status:", status);
          if (status === "SUBSCRIBED") {
            setIsConnected(true);
            setError(null);
            channelRef.current = newChannel;
            isSettingUpRef.current = false;
          } else if (status === "CLOSED") {
            setIsConnected(false);
            setError("Connection closed");
            isSettingUpRef.current = false;
            // Attempt to reconnect after a delay
            reconnectTimeoutRef.current = window.setTimeout(() => {
              console.log("Attempting to reconnect...");
              setupChannel();
            }, 2000);
          } else if (status === "CHANNEL_ERROR") {
            setIsConnected(false);
            setError("Channel error occurred");
            isSettingUpRef.current = false;
          }
        });
    } catch (err) {
      console.error("Error setting up realtime chat:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      isSettingUpRef.current = false;
    }
  }, [roomName, cleanupChannel]);

  useEffect(() => {
    console.log("Initializing realtime chat for room:", roomName);
    setupChannel();

    return () => {
      cleanupChannel();
    };
  }, [roomName, setupChannel, cleanupChannel]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channelRef.current || !isConnected) {
        console.log(
          "Cannot send message - channel:",
          !!channelRef.current,
          "isConnected:",
          isConnected
        );
        return;
      }

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        user: {
          name: username,
        },
        createdAt: new Date().toISOString(),
      };

      try {
        // Update local state immediately for the sender
        setMessages((current) => [...current, message]);

        await channelRef.current.send({
          type: "broadcast",
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        });
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err instanceof Error ? err.message : "Failed to send message");
      }
    },
    [isConnected, username]
  );

  return { messages, sendMessage, isConnected, error };
}
