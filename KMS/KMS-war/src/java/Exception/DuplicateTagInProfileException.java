/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Exception;

/**
 *
 * @author cassie
 */
public class DuplicateTagInProfileException extends Exception {

    /**
     * Creates a new instance of <code>DuplicateSkillInProfileException</code>
     * without detail message.
     */
    public DuplicateTagInProfileException() {
    }

    /**
     * Constructs an instance of <code>DuplicateSkillInProfileException</code>
     * with the specified detail message.
     *
     * @param msg the detail message.
     */
    public DuplicateTagInProfileException(String msg) {
        super(msg);
    }
}
