//
//  InstagramShareModule.swift
//  reveal
//
//  Created by Dhaval Shah on 16/12/23.
//

import Foundation
// InstagramShareModule.swift

import LNExtensionExecutor
import React

@objc(InstagramShareModule)
class InstagramShareModule: RCTEventEmitter {

  @objc func shareOnInstagram(_ activityItems: [Any]) {
    do {
      let executor = try LNExtensionExecutor(extensionBundleIdentifier: "com.example.InstagramShareExtension")
      let (completed, returnItems) = try await executor.execute(withActivityItems: activityItems, on: self)
      print("completed: \(completed) return items: \(returnItems)")
    } catch let error {
      print("error: \(error.localizedDescription)")
    }
    Conversion to Swift 5 is available
  }

  // Implement other methods if needed

  override func supportedEvents() -> [String] {
    return [] // Override if you need to emit events to JavaScript
  }
}
