//
//  LNExtensionExecutorUIController.swift
//  RNshare
//
//  Created by trimulabs on 1/1/24.
//


import Foundation
import UIKit
import LNExtensionExecutor
import SwiftUI

class ShareExtensionExecutor: ObservableObject {
    @MainActor
  func execute(extensionBundleIdentifier: String, shareItems: [Any], from presentingController: UIViewController) async throws -> Bool {
        let executor = try LNExtensionExecutor(extensionBundleIdentifier: extensionBundleIdentifier)
        let (completed, returnItems) = try await executor.execute(withActivityItems: shareItems, on: presentingController)
        print("completed: \(completed) return items: \(returnItems)")
      return completed
    }
}

@objc(LNExtensionExecutorModule)
class LNExtensionExecutorModule : NSObject {
  
  private var shareExecutor = ShareExtensionExecutor()
  private var isLoading = false // Track loading state
  
  @objc
  func shareWithInstagram(_ link: String) {
    if let rootController = UIApplication.shared.rootViewController {

      Task { @MainActor in
        do {
          let shareItems: [Any] = [URL(string: link)!, "Check out this website!"]
          _  = try await shareExecutor.execute(extensionBundleIdentifier: "com.burbn.instagram.shareextension", shareItems: shareItems, from: rootController)
        } catch {
          print(error.localizedDescription)
        }
      }
    }
  }

  @objc
  func socialShare(_ appid: String, title: String, message: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    if let rootController = UIApplication.shared.rootViewController {
      
      Task { @MainActor in
        do {
          let shareItems: [Any] = [URL(string: message)!, title]
          let completed  =  try await shareExecutor.execute(extensionBundleIdentifier: appid, shareItems: shareItems, from: rootController)
          resolve(completed)
        } catch {
          print(error.localizedDescription)
          reject("reject",error.localizedDescription, nil);
        }
      }
    }
  }
  
  
  @objc
  func shareWithSnapchat(_ link: String) {
    
    if let rootController = UIApplication.shared.rootViewController {
      Task { @MainActor in
        do {
          let shareItems: [Any] = [URL(string: link)!, "Check out this website!"]
          _  = try await shareExecutor.execute(extensionBundleIdentifier: "com.toyopagroup.picaboo.share", shareItems: shareItems, from: rootController)
        } catch {
          print(error.localizedDescription)
        }
      }
    }
  }
  
  @objc
  func shareWithWhatsApp(_ link: String) {
    
    if let rootController = UIApplication.shared.rootViewController {
      Task { @MainActor in
        do {
          let shareItems: [Any] = [URL(string: link)!, "Check out this website!"]
          _  = try await shareExecutor.execute(extensionBundleIdentifier: "net.whatsapp.WhatsApp.ShareExtension", shareItems: shareItems, from: rootController)
        } catch {
          print(error.localizedDescription)
        }
      }
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

// An extension to obtain the root UIViewController
extension UIApplication {
  var rootViewController: UIViewController? {
    connectedScenes
      .flatMap { ($0 as? UIWindowScene)?.windows ?? [] }
      .first(where: \.isKeyWindow)?.rootViewController
  }
}
