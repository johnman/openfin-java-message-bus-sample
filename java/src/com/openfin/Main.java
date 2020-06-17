package com.openfin;

import com.openfin.desktop.*;
import org.json.JSONObject;

import java.io.Console;
import java.io.IOException;
import java.lang.System;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import java.util.UUID;

public class Main {
    private static boolean connected = false;

    private static String lastFocus = null;

    public static void main(String[] args) {
        try {

            final DesktopConnection desktopConnection = new DesktopConnection(UUID.randomUUID().toString());
            final RuntimeConfiguration rcg = new RuntimeConfiguration();
            rcg.setRuntimeVersion("stable");
            desktopConnection.connect(rcg, new DesktopStateListener() {
                @Override
                public void onReady() {
                    try {
                        connected = true;
                        System.out.println("");
                        System.out.println("");
                        System.out.println("------------------------------------------------");
                        System.out.println("-        OpenFin Java Example               -");
                        System.out.println("------------------------------------------------");

                        System.out.println();
                        System.out.println("Connecting to OpenFin");
                        System.out.println("Connected to OpenFin");
                        System.out.println("");
                        System.out.println("Message Entries:");
                        System.out.println("");
                        final String[] list = new String[]{""};

                        try {

                            desktopConnection.getInterApplicationBus().subscribe("*", "demo-published", (String sourceUuid, String receivingTopic, Object payload) -> {

                                try {
                                    JSONObject message = (JSONObject) payload;
                                    String action = message.getString("action");
                                    DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                                    Date date = new Date();

                                    if(action.equals("ALL"))
                                    {
                                        if(lastFocus != null)
                                        {
                                            System.out.println(dateFormat.format(date) + ": Stopped focusing on " + lastFocus);
                                            lastFocus = null;
                                        }
                                    }
                                    else if(action.equals("RESPOND")){
                                        JSONObject response = new JSONObject();
                                        response.put("received", dateFormat.format(date));
                                        desktopConnection.getInterApplicationBus().publish("demo-java-response", response);
                                    }
                                    else
                                    {
                                        lastFocus = action;
                                        System.out.println(dateFormat.format(date) + ": Focused on " + lastFocus);
                                    }
                                } catch (Exception e) {
                                    System.out.println("Error: " +  e.getMessage());
                                }
                            });
                        } catch (Exception e) {
                            System.out.println("Error: " + e.getMessage());
                        }

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onClose(String error) {
                    System.out.println("Application Closed.");
                }

                @Override
                public void onError(String reason) {
                    System.out.println("Application Error: " + reason);
                }

                @Override
                public void onMessage(String message) {

                }

                @Override
                public void onOutgoingMessage(String message) {

                }
            }, 60);

            try {
                // keep Runtime running for 10 seconds
                Thread.sleep(3600000);
                desktopConnection.exit();
                // Give Runtime some time to exit
                Thread.sleep(3000);
            } catch (Exception e) {
                e.printStackTrace();
            }
            System.out.println("Before exit");

//            try {
//                // keep Runtime running for 10 seconds
//                Thread.sleep(20000);
//                desktopConnection.exit();
//                // Give Runtime some time to exit
//                Thread.sleep(3000);
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//            System.out.println("Before exit");
//
//        } catch (DesktopException e) {
//            e.printStackTrace();
//        } catch (DesktopIOException e) {
//            e.printStackTrace();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

        } catch (DesktopException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (DesktopIOException e) {
            e.printStackTrace();
        }
    }
}
