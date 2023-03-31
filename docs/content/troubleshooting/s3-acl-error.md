# S3 Plugin ACL Error

If you're using the [S3 Plugin](../plugins/file-service/s3.md) and, when you upload an image, you receive the following error on your Medusa backend:

```bash noReport
AccessControlListNotSupported: The bucket does not allow ACLs
```

Try the following:

1. Go to your S3 Bucket, then choose the Permissions tab.
2. Scroll to Object Ownership and click the Edit button.
3. Select ACLs enabled and choose for Object Ownership the radio button Bucket owner preferred.
4. Click the Save Changes.

Try uploading again after making this change. Upload should be successful.
