//
//  LNExtensionExecutorModule.m
//  RNshare
//
//  Created by trimulabs on 1/1/24.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
@interface

RCT_EXTERN_MODULE(LNExtensionExecutorModule, NSObject)

RCT_EXTERN_METHOD(shareWithWhatsApp: (NSString *) link)
RCT_EXTERN_METHOD(shareWithInstagram: (NSString *) link)
RCT_EXTERN_METHOD(shareWithSnapchat: (NSString *) link)
RCT_EXTERN_METHOD(socialShare: (NSString *)appid
                  title:(NSString *)title
                      message:(NSString *)message
                  resolve:(RCTPromiseResolveBlock *)resolve
                  reject:(RCTPromiseRejectBlock *)reject)
@end
