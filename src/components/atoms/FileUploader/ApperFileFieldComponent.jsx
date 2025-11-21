import React, { useState, useRef, useEffect, useMemo } from 'react';

const ApperFileFieldComponent = ({ elementId, config }) => {
  // State management
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Refs for lifecycle tracking
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementId ref when it changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoize existingFiles to detect actual changes
  const memoizedExistingFiles = useMemo(() => {
    const files = config?.existingFiles || [];
    // Return empty array if no files, otherwise return the files array
    return files.length === 0 ? [] : files;
  }, [config?.existingFiles?.length, config?.existingFiles?.[0]?.Id || config?.existingFiles?.[0]?.id]);

  // Initial mount effect
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Wait for ApperSDK to be available (max 50 attempts × 100ms = 5 seconds)
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!window.ApperSDK && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded. Please ensure the SDK script is included before this component.');
        }

        const { ApperFileUploader } = window.ApperSDK;
        
        // Set unique element ID
        elementIdRef.current = `file-uploader-${elementId}`;
        
        // Mount the file field
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: memoizedExistingFiles
        });

        if (mountedRef.current) {
          setIsReady(true);
          setError(null);
        }

      } catch (err) {
        console.error('Error initializing ApperFileFieldComponent:', err);
        if (mountedRef.current) {
          setError(err.message);
        }
      }
    };

    mountedRef.current = true;
    initializeSDK();

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      try {
        if (window.ApperSDK?.ApperFileUploader && elementIdRef.current) {
          window.ApperSDK.ApperFileUploader.FileField.unmount(elementIdRef.current);
        }
      } catch (err) {
        console.error('Error unmounting ApperFileFieldComponent:', err);
      }
      setIsReady(false);
      setError(null);
    };
  }, [elementId, config?.fieldKey]);

  // File update effect
  useEffect(() => {
    const updateFiles = async () => {
      // Early returns for safety
      if (!isReady || !window.ApperSDK?.ApperFileUploader || !config?.fieldKey) {
        return;
      }

      try {
        // Deep equality check to prevent unnecessary updates
        const currentFiles = JSON.stringify(memoizedExistingFiles);
        const previousFiles = JSON.stringify(existingFilesRef.current);
        
        if (currentFiles === previousFiles) {
          return;
        }

        // Update the ref with new files
        existingFilesRef.current = memoizedExistingFiles;

        const { ApperFileUploader } = window.ApperSDK;

        // Format detection - check if conversion needed
        let filesToUpdate = memoizedExistingFiles;
        if (filesToUpdate.length > 0 && filesToUpdate[0].Id) {
          // Convert from API format to UI format
          filesToUpdate = ApperFileUploader.toUIFormat(filesToUpdate);
        }

        // Update files or clear field
        if (filesToUpdate.length > 0) {
          await ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
        } else {
          await ApperFileUploader.FileField.clearField(config.fieldKey);
        }

      } catch (err) {
        console.error('Error updating files:', err);
        if (mountedRef.current) {
          setError(err.message);
        }
      }
    };

    updateFiles();
  }, [memoizedExistingFiles, isReady, config?.fieldKey]);

  // Error UI
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">Error loading file uploader: {error}</p>
      </div>
    );
  }

  // Main container - always render with unique ID
  return (
    <div className="w-full">
      <div id={`file-uploader-${elementId}`} className="min-h-[100px]">
        {!isReady && (
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading file uploader...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApperFileFieldComponent;